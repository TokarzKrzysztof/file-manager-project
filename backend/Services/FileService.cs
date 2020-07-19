using backend.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using backend.Models;
using backend.ViewModels;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public class FileService : IFileService
    {
        private readonly FileManagerDbContext _context;
        public FileService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteFiles(int[] ids, string userData)
        {
            foreach (int fileId in ids)
            {

                FileModel file = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileId);
                if (file != null)
                {
                    File.Delete(file.FilePath);

                    HistoryModel historyRow = new HistoryModel()
                    {
                        Description = "Użytkownik usunął plik o nazwie: " + file.FileName,
                        UserData = userData
                    };

                    _context.History.Add(historyRow);
                    _context.Files.Remove(file);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<FileStream> DownloadFile(ControllerBase controller, int id)
        {
            var file = await _context.Files.FirstOrDefaultAsync(x => x.Id == id);
            return new FileStream(file.FilePath, FileMode.Open, FileAccess.Read);
        }

        public async Task<string> GetFilePath(int fileId)
        {
            var file = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileId);
            return file.FilePath;
        }

        public async Task<List<FileViewModel>> GetFiles()
        {
            List<FileModel> dbFiles = await _context.Files.ToListAsync();
            return FileConverter.ConvertDbListToViewModelList(dbFiles);
        }

        public async Task UpdateFile(FileViewModel file)
        {
            FileModel dbFile = await _context.Files.FirstOrDefaultAsync(x => x.Id == file.id);
            dbFile = FileConverter.UpdateDbFileWithViewFileData(dbFile, file);
            _context.Files.Update(dbFile);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UploadFiles(IFormFileCollection files, string userData, int creatorId)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Files");

            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }

            int maxFilesPerHour = await _context.GlobalSettings.Select(x => x.LimitPerHour).FirstOrDefaultAsync();
            int amountUserCanUpload = await CheckAmountThatUserCanUpload(maxFilesPerHour, creatorId);

            for (int i = 0; i < files.Count; i++)
            {
                if (i == amountUserCanUpload)
                {
                    await _context.SaveChangesAsync();
                    var ex = new ApplicationException($"Przekroczono dopuszczalny limit wysłanych plików w ciągu godziny który wynosi: {maxFilesPerHour}, spróbuj ponownie później");
                    ex.Data.Add("reason", "LIMITUPLOAD");
                    throw ex;
                }

                IFormFile file = files[i];

                string fileName = file.FileName;
                string filePath = Path.Combine(pathToSave, fileName);
                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                FileModel fileToSave = new FileModel()
                {
                    FileName = fileName,
                    FilePath = filePath,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    CreatedBy = userData,
                    CreatorId = creatorId
                };

                HistoryModel historyRow = new HistoryModel()
                {
                    Description = "Użytkownik dodał plik o nazwie: " + fileName,
                    UserData = userData
                };

                _context.History.Add(historyRow);
                _context.Files.Add(fileToSave);
            }

            await _context.SaveChangesAsync();


            return true;
        }

        private async Task<int> CheckAmountThatUserCanUpload(int limitPerHour, int creatorId)
        {
            List<FileModel> filesAddedLastHour = await _context.Files
                .Where(x => x.CreatorId == creatorId && x.UploadTime > DateTime.Now.AddHours(-1))
                .OrderByDescending(x => x.UploadTime)
                .ToListAsync();

            if (limitPerHour > filesAddedLastHour.Count())
            {
                int canUploadAmount = limitPerHour - filesAddedLastHour.Count();
                return canUploadAmount;
            }

            return 0;
        }

    }
}

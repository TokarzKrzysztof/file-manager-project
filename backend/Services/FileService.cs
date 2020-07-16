using backend.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;
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
                        ActionDate = DateTime.Now,
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
            List<FileModel> dbFiles = await _context.Files.Where(x => x.IsActive).ToListAsync();
            return FileConverter.ConvertDbListToViewModelList(dbFiles);
        }

        public async Task<bool> UploadFiles(IFormFileCollection files, string userData)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Files");

            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }

            if (files.Count > 0)
            {
                foreach (IFormFile file in files)
                {
                    string fileName = file.FileName;
                    string filePath = Path.Combine(pathToSave, fileName);
                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    FileModel fileToSave = new FileModel()
                    {
                        Id = 0,
                        FileName = fileName,
                        FilePath = filePath,
                        UploadTime = DateTime.Now,
                        ContentType = file.ContentType,
                        Size = file.Length,
                        IsActive = true
                    };

                    HistoryModel historyRow = new HistoryModel()
                    {
                        ActionDate = DateTime.Now,
                        Description = "Użytkownik dodał plik o nazwie: " + fileName,
                        UserData = userData
                    };

                    _context.History.Add(historyRow);
                    _context.Files.Add(fileToSave);
                }

                await _context.SaveChangesAsync();
            }

            return true;
        }

    }
}

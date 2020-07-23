using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<List<FileViewModel>> GetFiles();
        Task<bool> UploadFiles(IFormFileCollection files, string userData, int creatorId, int folderId);
        Task<FileStream> DownloadFile(int id);
        Task<string> GetFilePath(int fileId);
        Task<bool> DeleteFiles(int[] ids, string userData);
        Task UpdateFile(FileViewModel file);
        Task<List<FileViewModel>> GetFilesInsideFolder(int folderId);
    }
}

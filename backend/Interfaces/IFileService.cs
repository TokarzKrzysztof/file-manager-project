using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<List<FileViewModel>> GetFiles();
        Task<bool> UploadFiles(IFormFileCollection files);
        Task<object> DownloadFile(int id);
        Task<bool> DeleteFiles(int[] ids);

    }
}

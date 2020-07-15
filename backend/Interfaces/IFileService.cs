using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        Task<FileResult> DownloadFile(ControllerBase controller, int id);
        Task<bool> DeleteFiles(int[] ids);

    }
}

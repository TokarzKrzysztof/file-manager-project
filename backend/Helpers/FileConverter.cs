using backend.Models;
using backend.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Helpers
{
    public class FileConverter
    {
        public static List<FileViewModel> ConvertDbListToViewModelList(List<FileModel> files)
        {
            List<FileViewModel> viewFiles = files.Select(x => {
                return new FileViewModel() {
                    id = x.Id,
                    fileName = x.FileName,
                    size = x.Size,
                    uploadTime = x.UploadTime,
                    createdBy = x.CreatedBy,
                    title = x.Title,
                    order = x.Order
                };
           }).ToList();

            return viewFiles;
        }

        public static FileModel UpdateDbFileWithViewFileData(FileModel dbFile, FileViewModel viewFile)
        {
            dbFile.Order = viewFile.order;
            dbFile.Title = viewFile.title;

            return dbFile;
        }
    }
}

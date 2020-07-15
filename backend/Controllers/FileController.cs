using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFiles()
        {
            try
            {
                List<FileViewModel> files = await _fileService.GetFiles();
                return Ok(files);
            }

            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFiles([FromForm] IFormFileCollection files)
        {
            try
            {
                await _fileService.UploadFiles(files);             
                return Ok();
            }

            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFiles([FromQuery] int[] fileIds)
        {
            try
            {
                await _fileService.DeleteFiles(fileIds);
                return Ok();
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("download")]
        public async Task<IActionResult> DownloadFile([FromQuery] int fileId)
        {
            try
            {
                FileResult file = await _fileService.DownloadFile(this, fileId);
                return Ok(file);
            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
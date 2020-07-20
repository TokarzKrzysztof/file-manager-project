using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class GlobalSettingsService : IGlobalSettingsService
    {
        private readonly FileManagerDbContext _context;
        public GlobalSettingsService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task<GlobalSettingsModel> GetGlobalSettings()
        {
            GlobalSettingsModel settings = await _context.GlobalSettings.FirstOrDefaultAsync(x => x.Id == 1);

            if (settings != null)
            {
                return settings;
            }
            else
            {
                throw new NullReferenceException("Brak globalnych ustawień!");
            }
        }

        public async Task SetGlobalSettings(GlobalSettingsModel settings)
        {
            _context.GlobalSettings.Update(settings);
            await _context.SaveChangesAsync();
        }
    }
}

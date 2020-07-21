using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly FileManagerDbContext _context;
        public HistoryService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task<List<HistoryModel>> GetHistory(int page, int pageSize, DateTime start, DateTime end)
        {
            if (start != DateTime.MinValue && end != DateTime.MinValue)
            {
                return await _context.History
                    .Where(x => x.ActionDate.Date >= start.Date && x.ActionDate.Date <= end.Date)
                    .OrderByDescending(x => x.ActionDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }

            return await _context.History
                .OrderByDescending(x => x.ActionDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetHistoryCount(int maxAmount, DateTime start, DateTime end)
        {
            if (start != DateTime.MinValue && end != DateTime.MinValue)
            {
                return await _context.History
                    .Where(x => x.ActionDate.Date >= start.Date && x.ActionDate.Date <= end.Date)
                    .CountAsync();
            }

            return await _context.History.CountAsync();
        }
    }
}

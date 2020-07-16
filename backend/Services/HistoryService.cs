using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class HistoryService: IHistoryService
    {
        private readonly FileManagerDbContext _context;
        public HistoryService(FileManagerDbContext context)
        {
            _context = context;
        }

        public async Task<List<HistoryModel>> GetHistory(int page, int pageSize)
        {
            return await _context.History.OrderByDescending(x => x.ActionDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<int> GetHistoryCount(int maxAmount)
        {
            return await _context.History.CountAsync();
        }
    }
}

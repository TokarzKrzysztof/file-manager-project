using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IHistoryService
    {
        Task<List<HistoryModel>> GetHistory(int page, int pageSize, DateTime start, DateTime end);
        Task<int> GetHistoryCount(int maxAmount, DateTime start, DateTime end);
    }
}

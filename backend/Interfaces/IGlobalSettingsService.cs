using backend.Models;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IGlobalSettingsService
    {
        Task<GlobalSettingsModel> GetGlobalSettings();
        Task SetGlobalSettings(GlobalSettingsModel settings);
    }
}

using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class FileManagerDbContext : DbContext
    {
        public FileManagerDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<FileModel> Files { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<HistoryModel> History { get; set; }
        public DbSet<GlobalSettingsModel> GlobalSettings { get; set; }
        public DbSet<FolderModel> Folders { get; set; }
        public DbSet<ShareableLinkModel> ShareableLinks { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GlobalSettingsModel>().HasData(new GlobalSettingsModel()
            {
                Id = 1,
                MinDigits = 0,
                MinLength = 0,
                BigLetters = 0,
                SpecialCharacters = 0,
                MaxSize = 1000,
                LimitPerHour = 20,
                TotalDiscSpace = 2147483648
            });
        }
    }
}


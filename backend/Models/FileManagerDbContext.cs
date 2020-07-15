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
    }
}


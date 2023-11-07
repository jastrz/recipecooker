using Core.Entities;

namespace Core.Interfaces
{
    public interface IEntityWithPictures
    {
        List<Picture> Pictures { get; set; }
    }
}
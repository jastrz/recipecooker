namespace Core.Entities
{
    public class Rating : BaseEntity
    {
        public double Value { get; set; }
        public string UserId { get; set; }

        public Rating(double value, string userId)
        {
            Value = value;
            UserId = userId;
        }
    }
}
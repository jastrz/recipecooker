namespace Core.Entities
{
    public class Rating : BaseEntity
    {
        public double Value { get; set; }

        public Rating(double value) => Value = value;
    }
}
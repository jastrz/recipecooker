using System.Text.Json;

namespace Core.Helpers
{
    public static class Utils
    {
        public static bool IsValidJson(string jsonString)
        {
            try
            {
                JsonDocument.Parse(jsonString);
                return true;
            }
            catch (JsonException)
            {
                return false;
            }
        }
    }
}
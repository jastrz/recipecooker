using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleCtrl : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Some()
        {
            return Ok();
        }
    }
}
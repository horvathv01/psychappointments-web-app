using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Models;
using MelaIdopontok.Program.Service;
using Microsoft.AspNetCore.Mvc;

namespace MelaIdopontok.Program.Controllers;


[ApiController]
[Route("/login")]
public class LoginController : ControllerBase
{
    private Person? _user = null;
    private ManagerBase? _manager = null;
    private IRepository<Psychologist> _psychologistRepository;
    private IRepository<Slot> _slotRepository;
    private IRepository<Session> _sessionRepository;
    private ManagerFactory _managerFactory;
    private PersonFactory _personFactory;

    public LoginController(IRepository<Psychologist> psychologistRepository, IRepository<Slot> slotRepository, IRepository<Session> sessionRepository)
    {
        _psychologistRepository = psychologistRepository;
        _slotRepository = slotRepository;
        _sessionRepository = sessionRepository;
        //dependency injection for these too?
        _managerFactory = new ManagerFactory(_psychologistRepository, _slotRepository, _sessionRepository);
        _personFactory = new PersonFactory();
    }

    [HttpPost("/")]
    public IActionResult Login([FromBody] string userName, [FromBody] string password)
    {
        try
        {
            Person user = _personFactory.CreatePerson(PersonType.Psychologist, userName);
            _manager = _managerFactory.CreateManagerService(user);
            //retreive user DB based on e-mail & password
            //instantiate typed userService
            //find relevant starter data to show on first page
            //send back relevant data
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest("Invalid username/e-mail or password.");
        }
    }

    [HttpPost("/logout")]
    public IActionResult LogOut()
    {
        _user = null;
        _manager = null;
        return Ok();
    }
    
    

}
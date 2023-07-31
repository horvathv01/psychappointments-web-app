using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public class ManagerFactory
{
    protected IRepository<Psychologist> _psychologistRepository;
    protected IRepository<Slot> _slotRepository;
    protected IRepository<Session> _sessionRepository;
    public ManagerFactory(IRepository<Psychologist> psychologistRepository, IRepository<Slot> slotRepository,
        IRepository<Session> sessionRepository)
    {
        _psychologistRepository = psychologistRepository;
        _slotRepository = slotRepository;
        _sessionRepository = sessionRepository;
    }
    
    public ManagerBase CreateManagerService(Person user)
    {
        if (user is Psychologist)
        {
            return new PsychologistManager(_psychologistRepository, _slotRepository, _sessionRepository);
        }
        if (user is Manager)
        {
            return new ManagerManager(_psychologistRepository, _slotRepository, _sessionRepository);
        }
        if (user is Client)
        {
            return new ClientManager(_psychologistRepository, _slotRepository, _sessionRepository);
        }

        return null;
    }
}
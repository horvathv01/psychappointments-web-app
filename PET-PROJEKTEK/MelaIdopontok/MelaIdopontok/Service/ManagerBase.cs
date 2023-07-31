using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public class ManagerBase
{
    protected IRepository<Psychologist> _psychologistRepository;
    protected IRepository<Slot> _slotRepository;
    protected IRepository<Session> _sessionRepository;
    public ManagerBase(IRepository<Psychologist> psychologistRepository, IRepository<Slot> slotRepository,
        IRepository<Session> sessionRepository)
    {
        _psychologistRepository = psychologistRepository;
        _slotRepository = slotRepository;
        _sessionRepository = sessionRepository;
    }
}
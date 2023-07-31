using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public class ClientManager : ManagerBase, IClientManager
{
    public ClientManager(IRepository<Psychologist> psychologistRepository, IRepository<Slot> slotRepository, IRepository<Session> sessionRepository) 
        : base(psychologistRepository, slotRepository, sessionRepository)
    {
        
    }
    
    
}
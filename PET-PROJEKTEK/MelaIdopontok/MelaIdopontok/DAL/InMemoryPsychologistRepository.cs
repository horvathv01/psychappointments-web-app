using MelaIdopontok.Models;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.DAL;

public class InMemoryPsychologistRepository : IRepository<Psychologist>
{
    private List<Session> _sessions;
    private List<Slot> _slots;

    public InMemoryPsychologistRepository()
    {
        _sessions = new List<Session>();
        _slots = new List<Slot>();
    }


    
    
    public Psychologist GetItemById(int id)
    {
        throw new NotImplementedException();
    }

    public List<Psychologist> GetAllItems()
    {
        throw new NotImplementedException();
    }

    public Psychologist CreateItem(Psychologist item)
    {
        throw new NotImplementedException();
    }

    public Psychologist UpdateItem(Psychologist item)
    {
        throw new NotImplementedException();
    }

    public Psychologist DeleteItem(Psychologist item)
    {
        throw new NotImplementedException();
    }
}


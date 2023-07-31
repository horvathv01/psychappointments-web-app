using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.DAL;

public class InMemorySessionRepository : IRepository<Session>
{
    public Session GetItemById(int id)
    {
        throw new NotImplementedException();
    }

    public List<Session> GetAllItems()
    {
        throw new NotImplementedException();
    }

    public Session CreateItem(Session item)
    {
        throw new NotImplementedException();
    }

    public Session UpdateItem(Session item)
    {
        throw new NotImplementedException();
    }

    public Session DeleteItem(Session item)
    {
        throw new NotImplementedException();
    }
}
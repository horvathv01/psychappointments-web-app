using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Enums;
using MelaIdopontok.Program.Models;
using MelaIdopontok.Program.Service;

namespace MelaIdopontok.Models;

public class Client : Person
{
    public List<Session> Sessions;

    public Client(string name, List<Session>? sessions = null) : base(name)
    {
        Sessions = sessions ?? new List<Session>();
        Type = PersonType.Client;
    }

    public Session AddSession(Session session)
    {
        Sessions.Add(session);
        return session;
    }

    public Session RemoveSession(Session session)
    {
        Sessions.Remove(session);
        return session;
    }
    
}
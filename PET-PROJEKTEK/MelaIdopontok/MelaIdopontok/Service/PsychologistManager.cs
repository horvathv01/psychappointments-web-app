using MelaIdopontok.Models;
using MelaIdopontok.Program.DAL;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public class PsychologistManager : ManagerBase, IPsychologistManager
{
    public PsychologistManager(IRepository<Psychologist> psychologistRepository, IRepository<Slot> slotRepository, IRepository<Session> sessionRepository) 
        : base(psychologistRepository, slotRepository, sessionRepository)
    {
    }
    
    public Session AddSession(Psychologist psychologist, Client client, DateTime start, DateTime end, double price)
    {
        int id= _sessionRepository.GetAllItems().Count;
        Session session = new Session(id, psychologist, client, start, end, price);
        _sessionRepository.CreateItem(session);
        return session;
    }

    public Session RemoveSession(int id)
    {
        Session session = _sessionRepository.GetItemById(id);
        _sessionRepository.DeleteItem(session);
        return session;
    }

    public Slot AddSlot(Psychologist psychologist, DateTime start, int length, double roomPrice)
    {
        int id = _slotRepository.GetAllItems().Count;
        Slot slot = new Slot(id, psychologist, start, length, roomPrice);
        _slotRepository.CreateItem(slot);
        return slot;
    }

    public Slot RemoveSlot(int id)
    {
        Slot slot = _slotRepository.GetItemById(id);
        _slotRepository.DeleteItem(slot);
        return slot;
    }

    public List<Slot> GetEmptySlots()
    {
        List<Slot> slots = _slotRepository.GetAllItems();
        return slots.Where(slot => slot.Sessions.Count == 0).ToList();
    }
}
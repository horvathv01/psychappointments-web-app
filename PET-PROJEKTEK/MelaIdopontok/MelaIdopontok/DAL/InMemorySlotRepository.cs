using MelaIdopontok.Models;
using MelaIdopontok.Program.Models;
using MelaIdopontok.Program.Service;

namespace MelaIdopontok.Program.DAL;

public class InMemorySlotRepository : IRepository<Slot>
{
    private List<Slot> _slots;

    public InMemorySlotRepository()
    {
        _slots = new List<Slot>();
    }

    public InMemorySlotRepository(List<Slot> slots)
    {
        _slots = slots;
    }
    
    public Slot GetItemById(int id)
    {
        return _slots.First(item => item.Id == id);
    }

    public List<Slot> GetAllItems()
    {
        return _slots;
    }

    public Slot CreateItem(Slot item)
    {
        _slots.Add(item);
        return item;
    }

    public Slot UpdateItem(Slot item)
    {
        Slot slot = _slots.First(slot => slot.Id == item.Id);
        slot.Start = item.Start;
        slot.End = item.End;
        slot.Sessions = item.Sessions;
        slot.RoomPrice = item.RoomPrice;
        return slot;
    }

    public Slot DeleteItem(Slot item)
    {
        _slots.Remove(item);
        return item;
    }
}
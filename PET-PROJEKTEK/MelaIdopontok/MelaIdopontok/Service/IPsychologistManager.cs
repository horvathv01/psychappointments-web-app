using MelaIdopontok.Models;
using MelaIdopontok.Program.Models;

namespace MelaIdopontok.Program.Service;

public interface IPsychologistManager
{
    public Session AddSession(Psychologist psychologist, Client client, DateTime start, DateTime end, double price);
    public Session RemoveSession(int id);

    public Slot AddSlot(Psychologist psychologist, DateTime start, int length, double roomPrice);

    public Slot RemoveSlot(int id);

    public List<Slot> GetEmptySlots();
}
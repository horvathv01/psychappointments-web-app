using MelaIdopontok.Models;

namespace MelaIdopontok.Program.Models;

public class Location
{
    public int ID = 0;
    public string Name;
    public List<Slot> _slots;
    public List<PriceRule> _priceRules;
    
    public Location(int id, string name, List<Slot>? slots = null, List<PriceRule>? priceRules = null)
    {
        ID = id;
        Name = name;
        _slots = slots ?? new List<Slot>();
        _priceRules = priceRules ?? new List<PriceRule>();
    }
    

    public override bool Equals(object? obj)
    {
        return obj is Location
               && ID == ((Location)obj).ID
               && Name == ((Location)obj).Name;
    }
}
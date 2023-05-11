using MelaIdopontok.Models;

namespace MelaIdopontok.Program.Models;

public class Location
{
    public string name { get; private set; }
    private List<Slot> _slots = new List<Slot>();
    private List<PriceRule> _priceRules = new List<PriceRule>();
    private static int id = 0;

    public Location(string name)
    {
        this.name = name;
        id++;
    }

    //change name
    public void ChangeName(string newName)
    {
        name = newName;
        Console.WriteLine($"Name of place changed to {name}");
    }
    
    
    //add slot
    public void AddSlot(Slot newSlot)
    {
        //verify if timeslot has not been taken before
        DateTime newStart = newSlot.Start;
        DateTime newEnd = newSlot.End;
        foreach (var slot in _slots)
        {
            if ((newStart > slot.Start && newStart < slot.End) || (newEnd > slot.Start && newEnd < slot.End ))
            {
                Console.WriteLine("New session cannot be added: you already have a slot in the desired time!");
                return;
            }
        }
        _slots.Add(newSlot);
        Console.WriteLine($"New slot added to {name}, at {newSlot.Start}. Now you have {_slots.Count} slots.");
    }
    
    //set slot pending status
    public void SetSlotPendingStatus(Slot desiredSlot, bool input)
    {
        foreach (var slot in _slots)
        {
            if (slot.Equals(desiredSlot))
            {
                slot.SetPending(input);
                Console.WriteLine($"Your slot between {desiredSlot.Start} and {desiredSlot.End} has been set to pending status: {input}.");
                return;
            }
        }
        Console.WriteLine("The desired slot has not been found. Please try again.");
    }
    
    //fill slot
    public void AddSession(Slot desiredSlot, Session newSession)
    {
        if (desiredSlot.Taken)
        {
            Console.WriteLine($"This slot has already been taken: {desiredSlot.Session}.");
            return;
        }
        //find slot --> if null, message: slot does not exist yet. Do you want me to create it for you?
        foreach (var slot in _slots)
        {
            if (slot.Equals(desiredSlot))
            {
                slot.SetTaken(true);
                slot.Session = newSession;
                Console.WriteLine($"Your slot in {name} between {slot.Start} and {slot.End} is now taken by {newSession.Person.name}");
                return;
            }
        }

        Console.WriteLine($"The desired slot at {desiredSlot.Start} does not exist yet. Do you want me to create it? Y/N");
        NonExistentSlotQuestion(desiredSlot);
        
    }

    public void NonExistentSlotQuestion(Slot desiredSlot)
    {
        string input = Console.ReadLine();
        if (input.ToLower() == "y")
        {
            Console.WriteLine($"Yes registered. Attempting to create new slot between {desiredSlot.Start} and {desiredSlot.End}.");
            AddSlot(desiredSlot);
        } else if (input.ToLower() == "n")
        {
            Console.WriteLine("No registered. Your new session has not been added. Please create a slot and add new session");
        }
        else
        {
            Console.WriteLine($"I didn't catch that. Would you like to create new slot between {desiredSlot.Start} and {desiredSlot.End}?");
            NonExistentSlotQuestion(desiredSlot);
        }
    }

    //empty slot
    public void EmptySlot(Slot desiredSlot)
    {
        Console.WriteLine($"You are now attempting to empty your slot between {desiredSlot.Start} and {desiredSlot.End}.");
        if (Confirm() == false)
        {
            return;
        }
        foreach (var slot in _slots)
        {
            if (slot.Equals(desiredSlot))
            {
                slot.SetTaken(false);
                slot.Session = null;
                Console.WriteLine($"Your slot between {desiredSlot.Start} and {desiredSlot.End} has been emptied.");
                return;
            }
        }

        Console.WriteLine("The desired slot has not been found. Please try again.");
    }

    //confirm choice
    public bool Confirm()
    {
        bool answer = false;
        Console.WriteLine("Are you sure?");
        string input = Console.ReadLine();
        if (input.ToLower() == "y")
        {
            answer = true;
        } else if (input.ToLower() == "n")
        {
            answer = false;
        }
        else
        {
            Confirm();
        }
        return answer;
    }
    
    
    
    //remove slot
    public void DeleteSlot(Slot desiredSlot)
    {
        Console.WriteLine($"You are now attempting to delete your slot between {desiredSlot.Start} and {desiredSlot.End}.");
        if (Confirm() == false)
        {
            return;
        }
        foreach (var slot in _slots)
        {
            if (slot.Equals(desiredSlot))
            {
                _slots.Remove(slot);
                Console.WriteLine($"Your slot between {desiredSlot.Start} and {desiredSlot.End} has been deleted.");
            }
        }
    }

    //about place(print name, id, number of slots, number of slots taken, number of empty slots, list of price rules)
    public void AboutPlace()
    {
        int takenSlots = 0;
        foreach (var slot in _slots)
        {
            if (slot.Taken)
            {
                takenSlots++;
            }
        }
        Console.WriteLine($"Info about place {name}, id {id}:");
        Console.WriteLine($"You have {_slots.Count} slots; {takenSlots} taken, {_slots.Count - takenSlots} open.");
        if (_priceRules.Count < 0)
        {
            Console.WriteLine($"You have {_priceRules.Count} price rules at this place: ");
            foreach (var rule in _priceRules)
            {
                Console.WriteLine($"{rule}");
            }
        }
        else
        {
            Console.WriteLine("You have 0 price rules at this place.");
        }
    }
    
    
    //list all slots
    public void ListAllSlots()
    {
        int totalRoomPrice = 0;
        int totalIncome = 0;
        
        foreach (var slot in _slots)
        {
            if (slot.Taken)
            {
                Console.WriteLine($"Slot between {slot.Start} and {slot.End}, taken by {slot.Session.Person.name}. Room price: {slot.RoomPrice}, income: {slot.Session.Price}");
                totalIncome += slot.RoomPrice;
                totalIncome += slot.Session.Price;
            }
            else
            {
                Console.WriteLine($"Slot between {slot.Start} and {slot.End}, status: open. Room price: {slot.RoomPrice}.");
                totalIncome += slot.RoomPrice;
            }
        }

        Console.WriteLine($"Total room price: {totalRoomPrice}. Total income: {totalIncome}");
    }
    
    //list taken slots - optional argument: price? name?
    public void ListTakenSlots()
    {
        int totalRoomPrice = 0;
        int totalIncome = 0;
        
        foreach (var slot in _slots)
        {
            if (slot.Taken)
            {
                Console.WriteLine($"Slot between {slot.Start} and {slot.End}, taken by {slot.Session.Person.name}. Room price: {slot.RoomPrice}, income: {slot.Session.Price}");
                totalIncome += slot.RoomPrice;
                totalIncome += slot.Session.Price;
            }
        }
        Console.WriteLine($"You pay {totalRoomPrice} in total for your occupied slots. Total income: {totalIncome}");
    }
    
    //list empty slots - optional argument: price?
    public void ListEmptySlots()
    {
        int totalRoomPrice = 0;
        
        foreach (var slot in _slots)
        {
            if (slot.Taken == false)
            {
                Console.WriteLine($"Slot between {slot.Start} and {slot.End}, status: open. Room price: {slot.RoomPrice}.");
                totalRoomPrice += slot.RoomPrice;
            }
        }
        Console.WriteLine($"You pay {totalRoomPrice} in total for your unoccupied slots.");
    }

    //list price rules
    public void ListPriceRules()
    {
        foreach (var rule in _priceRules)
        {
            Console.WriteLine(rule);
        }
    }

    //empty all slots
    public void EmptyAllSlots()
    {
        Console.WriteLine("You are now attempting to empty all your slots.");
        if (Confirm() == false)
        {
            return;
        }

        foreach (var slot in _slots)
        {
            slot.SetTaken(false);
            slot.Session = null;
        }

        Console.WriteLine($"All of your {_slots.Count} slots have been emptied.");
    }
    
    //remove all slots
    public void DeleteAllSlots()
    {
        Console.WriteLine("You are now attempting to DELETE all your slots.");
        if (Confirm() == false)
        {
            return;
        }

        foreach (var slot in _slots)
        {
            _slots.Remove(slot);
        }

        Console.WriteLine($"All of your {_slots.Count} slots have been deleted.");
    }
}
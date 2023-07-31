using MelaIdopontok.Models;

namespace MelaIdopontok.Program.Models;

public class Session
{
    public int Id;
    public Psychologist Psychologist;
    public Client Client { get; }

    public DateTime Start;
    public DateTime End;
    public double Price { get; }
 

    public Session(int id, Psychologist psychologist, Client client, DateTime start, DateTime end, double price)
    {
        Id = id;
        Psychologist = psychologist;
        Client = client;
        Start = start;
        End = end;
        Price = price;
    }

    public override bool Equals(object? obj)
    {
        return obj is Session ses
               && ses.Client.Equals(Client)
               && ses.Price == Price;
    }
}
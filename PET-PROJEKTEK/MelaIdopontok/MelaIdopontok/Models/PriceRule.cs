namespace MelaIdopontok.Program.Models;

public class PriceRule
{
    private int _numOfSessions { get; }
    private double _discount { get; }
    
    public PriceRule(int numOfSessions, double discount)
    {
        _numOfSessions = numOfSessions;
        _discount = discount;
    }
    
    public double Discount(List<Session> sessionsList)
    {
        double answer = 0;
        if (sessionsList.Count() == _numOfSessions)
        {
            answer = _discount;
        }
        return answer;
    }

    public override bool Equals(object? obj)
    {
        return obj is PriceRule rule
               && rule._discount == _discount
               && rule._numOfSessions == _numOfSessions;
    }
}
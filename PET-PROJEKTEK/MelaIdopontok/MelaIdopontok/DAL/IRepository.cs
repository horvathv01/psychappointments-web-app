namespace MelaIdopontok.Program.DAL;

public interface IRepository<T>
{
    T GetItemById(int id);
    List<T> GetAllItems();
    T CreateItem(T item);
    T UpdateItem(T item);
    T DeleteItem(T item);
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FindIT.Models
{
    public class ContractAndConsults
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? TotalPrice { get; set; }
        public List<ContractConsult> Consults { get; set; }
    }

    public class ContractConsult
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public decimal? Salary { get; set; }
        public int? Experience { get; set; }
        public bool Available { get; set; }
        public string Details { get; set; }
    }
}

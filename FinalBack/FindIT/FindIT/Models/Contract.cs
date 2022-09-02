using System;
using System.Collections.Generic;

#nullable disable

namespace FindIT.Models
{
    public partial class Contract
    {
        public Contract()
        {
            Teams = new HashSet<Team>();
        }

        public int? Id { get; set; }
        public string Title { get; set; }
        public string Customer_Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? TotalPrice { get; set; }

        public virtual ICollection<Team> Teams { get; set; }
    }
}

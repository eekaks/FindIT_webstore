using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FindIT.Models
{
    public class ConsultSkillContract
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public decimal? Salary { get; set; }
        public int? Experience { get; set; }
        public bool Available { get; set; }
        public string Details { get; set; }
        public List<string> Skills { get; set; }
        public List<ConsultContract> Contracts { get; set; }
    }

    public class ConsultContract
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

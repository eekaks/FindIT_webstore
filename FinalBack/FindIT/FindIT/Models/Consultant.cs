using System;
using System.Collections.Generic;

#nullable disable

namespace FindIT.Models
{
    public partial class Consultant
    {
        public Consultant()
        {
            ConsultantSkills = new HashSet<Consultant_skills>();
            Teams = new HashSet<Team>();
        }

        public int? Id { get; set; }
        public string Name { get; set; }
        public decimal? Salary { get; set; }
        public int? Experience { get; set; }
        public bool Available { get; set; }
        public string Details { get; set; }

        public virtual ICollection<Consultant_skills> ConsultantSkills { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
    }
}

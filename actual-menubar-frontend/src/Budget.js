import React from "react";
import { format, getDaysInMonth } from "date-fns";

export default ({ budget }) => {
  const date = new Date();
  return !budget ? null : (
    <section>
      <h1 className="month">{format(date, "LLLL")}</h1>
      {budget.categoryGroups
        .filter(category => !category.is_income)
        .map(group => (
          <div key={group.id}>
            <h2>{group.name}</h2>
            <section className="categories">
              {group.categories.map(category => (
                <div className="category" key={category.id}>
                  <label htmlFor={category.name}>{category.name}</label>
                  <div className="progress">
                    <div
                      className="tick"
                      style={{
                        left: `${(date.getUTCDate() / getDaysInMonth(date)) *
                          100}%`
                      }}
                    />
                    <progress
                      id={category.name}
                      max="1"
                      value={
                        Number(category.budgeted)
                          ? Math.abs(Number(category.spent)) /
                            Number(category.budgeted)
                          : 0
                      }
                    >
                      {category.name}
                    </progress>
                  </div>
                </div>
              ))}
            </section>
          </div>
        ))}
    </section>
  );
};

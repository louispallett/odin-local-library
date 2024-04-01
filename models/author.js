const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        first_name: { type: String, required: true, maxLength: 100 },
        family_name: { type: String, required: true, maxLength: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }
);

// This allows us to access the property 'name' even though it isn't on the database - we effectively
// create it here
AuthorSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    return fullname;
});

AuthorSchema.virtual("url").get(function() {
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("birth_date_formatted").get(function() {
    return this.date_of_birth 
        ?  DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
        : "<Author birth unavailable>";
});

AuthorSchema.virtual("death_date_formatted").get(function() {
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
        : "";
});

AuthorSchema.virtual("lifespan").get(function() {
    return this.date_of_birth && this.date_of_death 
    ? `[Lifespan: ${this.date_of_death.getFullYear() - this.date_of_birth.getFullYear()} years]`
    : "";
});

AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
})

AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function() {
    return DateTime.fromJSDate(this.date_of_death).toISODate();
})

module.exports = mongoose.model("Author", AuthorSchema);

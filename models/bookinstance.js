const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    imprint: { type: String, required: true },
    status: 
    {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual("url").get(function () {
    return `/catalog/bookinstance/${this._id}`;
});

// Formatting date and time (using luxon library)
BookInstanceSchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
});  

module.exports = mongoose.model("BookInstance", BookInstanceSchema);

/* 
Some notes on the code above:

    enum    Allows us to set the allowed values of a string.
    default To set the default status of the book in case none is given
    
*/
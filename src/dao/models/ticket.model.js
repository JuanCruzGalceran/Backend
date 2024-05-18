import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

ticketSchema.pre("save", async function (next) {
  const ticket = this;
  if (!ticket.code) {
    ticket.code = `TICKET-${Date.now()}`;
  }
  next();
});

const ticketModel = mongoose.model("tickets", ticketSchema);

export default ticketModel;

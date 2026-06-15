export function validateOrder(req, res, next) {
  const { branch_id, customer_name, customer_phone, items, payment_method } =
    req.body;
  const errors = [];
  if (!branch_id) errors.push("branch_id is required");
  if (!customer_name?.trim()) errors.push("customer_name is required");
  if (!customer_phone?.trim()) errors.push("customer_phone is required");
  if (!items || !Array.isArray(items) || items.length === 0)
    errors.push("items must be a non-empty array");
  if (!["pickup", "online"].includes(payment_method))
    errors.push("payment_method must be pickup or online");
  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });
  next();
}

export function validateReservation(req, res, next) {
  const { branch_id, customer_name, customer_phone, party_size, date, time } =
    req.body;
  const errors = [];
  if (!branch_id) errors.push("branch_id is required");
  if (!customer_name?.trim()) errors.push("customer_name is required");
  if (!customer_phone?.trim()) errors.push("customer_phone is required");
  if (!party_size || isNaN(party_size)) errors.push("party_size is required");
  if (!date) errors.push("date is required");
  else if (new Date(date) < new Date(new Date().toDateString()))
    errors.push("date cannot be in the past");
  if (!time) errors.push("time is required");
  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });
  next();
}

export function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body;
  const errors = [];
  if (!name?.trim()) errors.push("name is required");
  if (!email?.trim()) errors.push("email is required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("valid email required");
  if (!subject) errors.push("subject is required");
  if (!message?.trim()) errors.push("message is required");
  else if (message.trim().length < 10)
    errors.push("message must be at least 10 characters");
  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });
  next();
}

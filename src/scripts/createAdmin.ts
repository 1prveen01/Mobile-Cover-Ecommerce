import "dotenv/config";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.model";

async function createAdmin() {
  await dbConnect();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
  const ADMIN_FULLNAME = process.env.ADMIN_FULLNAME ?? "Admin";
  const ADMIN_MOBILE = process.env.ADMIN_MOBILE!;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_MOBILE) {
    console.error("Please set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_MOBILE in .env");
    process.exit(1);
  }

  const existingAdmin = await UserModel.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    process.exit(0);
  }

  const existingUser = await UserModel.findOne({
    $or: [{ email: ADMIN_EMAIL }, { mobileNumber: ADMIN_MOBILE }],
  });

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (existingUser) {
    existingUser.role = "admin";
    existingUser.isVerified = true;
    existingUser.password = hashedPassword;
    existingUser.fullName = ADMIN_FULLNAME;
    await existingUser.save();
    console.log("Existing user promoted to admin:", existingUser.email);
  } else {
    const newAdmin = new UserModel({
      fullName: ADMIN_FULLNAME,
      email: ADMIN_EMAIL,
      mobileNumber: ADMIN_MOBILE,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    await newAdmin.save();
    console.log("New admin created:", newAdmin.email);
  }

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});

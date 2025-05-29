export const revalidate = 0;

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (req, res) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { userId } = await req.json();

  try {
    connectDB();
    if (user.isAdmin !== true && user.isSuper !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await userModel.findOneAndUpdate({ _id: userId }, { blocked: false });
    return NextResponse.json(
      { message: "Account Reactivated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

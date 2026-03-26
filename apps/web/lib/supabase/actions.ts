"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

export async function createPrinter(printerData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("printers")
    .insert([printerData])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/printers");
  return data;
}

export async function updatePrinter(printerId: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("printers")
    .update(updates)
    .eq("id", printerId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/printers");
  return data;
}

export async function deletePrinter(printerId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("printers")
    .delete()
    .eq("id", printerId);

  if (error) throw error;
  revalidatePath("/admin/printers");
}

export async function createStaffProfile(staffData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_profiles")
    .insert([staffData])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/staff");
  return data;
}

export async function updateStaffStatus(staffId: string, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", staffId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/staff");
  return data;
}

export async function deleteStaffProfile(staffId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_profiles")
    .delete()
    .eq("id", staffId);

  if (error) throw error;
  revalidatePath("/admin/staff");
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return data;
}

export async function updateShopSettings(shopId: string, data: any) {
  const supabase = await createClient();

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.upi_id !== undefined) updateData.upi_id = data.upi_id;
  if (data.bank_details !== undefined) updateData.bank_details = data.bank_details;
  if (data.settings !== undefined) updateData.settings = data.settings;

  const { error } = await supabase
    .from("shops")
    .update(updateData)
    .eq("id", shopId);

  if (error) throw error;

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { success: true };
}

import { getReportData, getTransactions } from "./queries";

export async function fetchReportData(shopId: string, days = 30) {
  return getReportData(shopId, days);
}

export async function fetchTransactions(shopId: string, limit = 20) {
  return getTransactions(shopId, limit);
}

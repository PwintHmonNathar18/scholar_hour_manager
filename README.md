<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Scholar Hour Manager – Scholarship Hour Management System

## 👥 Team Members
- Pwint Hmon Nathar [GitHub](https://github.com/PwintHmonNathar18)
- Thant Shwe Yee Lin [GitHub](https://github.com/ThantShweYeeLin)

---

## 📖 Project Description
Scholar Hour Manager is a **Next.js web app** that helps universities manage scholarship hours.  
It provides a portal for admins, supervisors, and students to schedule, track, and approve scholarship shifts in a transparent and efficient way.

### ✨ Problems It Solves
- Manual timesheets and spreadsheets are error-prone and time-consuming.  
- Lack of visibility leads to over/under-allocation of student hours.  
- Students struggle to view assigned shifts in one place.  
- Admins find compliance reporting slow and inconsistent.  

### 🎯 Target Users
- **Admin (Scholarship Office)** – manages programs, policies, and audits.  
- **Supervisor (Department Staff)** – assigns shifts and approves hours.  
- **Scholarship Students** – view schedule, check in/out, and request leave/swap.  

---

## 🔧 Features
- Role-based login (Admin / Supervisor / Student).  
- CRUD operations for at least **3 entities**:
  - **Student** – profile, assigned program, GPA, max hours/week  
  - **Shift** – schedule with date, location, supervisor  
  - **Attendance** – check-in/out, linked to student & shift  
- Timesheet auto-generation from attendance records.   

---

## 🗄️ Data Models
1. **Student** – id, name, program, GPA, maxHoursPerWeek  
2. **Shift** – id, date, start, end, supervisor
3. **Attendance** – id, studentId, shiftId, checkIn, checkOut  

(Additional: Supervisor, Timesheet, Request)

---

## 📷 Screenshots
(Will be added later after UI is implemented)

---
>>>>>>> 3e77b1512d7e0441a025afca7a02c26d8efd4934

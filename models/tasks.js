import mongoose from "mongoose";

const EmployeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            lowercase: true,
            trim: true,
            minLength: [1, "Name cannot be empty"],
            maxLength: [20, "Name cannot exceed 20 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            minLength: [5, "Email is too short"],
            maxLength: [50, "Email cannot exceed 50 characters"],
            unique: true,
        },
        status: {
            type: String,
            required: [true, "Status is required"], // ❗ fixed typo (reuired → required)
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            lowercase: true,
            trim: true,
            minLength: [1, "Role cannot be empty"],
            maxLength: [50, "Role cannot exceed 50 characters"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            minLength: [11, "Phone number must be 11 digits"],
            maxLength: [11, "Phone number must be 11 digits"],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters"],
        },
        adminCode: {
            type: String,
            required: [true, "Admin code is required"],
            minLength: [6, "Admin code must be 6 characters"],
            maxLength: [6, "Admin code must be 6 characters"],
            trim: true,
            // unique: true,
        },
        address: {
            type: String,
            default: "Not provided"
        },
        wkratings: {
            type: String,
            default: "Not Yet"
        }
    }, {
        timestamps: true,
    }
)

const EmployerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            lowercase: true,
            minLength: [1, "Name cannot be empty"],
            maxLength: [20, "Name cannot exceed 20 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            minLength: [5, "Email is too short"],
            maxLength: [50, "Email cannot exceed 50 characters"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            minLength: [11, "Phone number must be 11 digits"],
            maxLength: [11, "Phone number must be 11 digits"],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters"],
        },
        adminCode: {
            type: String,
            required: [true, "Admin code is required"],
            minLength: [6, "Admin code must be 6 characters"],
            maxLength: [6, "Admin code must be 6 characters"],
            trim: true,
            unique: true,
        },
        employees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        }]
    },{
        timestamps: true,
    }
)

export const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
export const EmployerModel = mongoose.model('Employer', EmployerSchema);
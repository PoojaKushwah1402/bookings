/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
// export const shorthands = {
//     createdAt: {
//         type: "timestamp"
//     },
//     updatedAt: {
//         type: "timestamp"
//     }
// };
exports.up = (pgm) => {
    pgm.createExtension("pgcrypto", {ifNotExists: true});

    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },
        role: {type: "text", notNull: true},
        created_at: {
            type: "timestamp",
            default: pgm.func("now()")
        },
        email: {type: "text", notNull: true, unique: true},
        password_hash: {type: "text", notNull: true},
        updated_at: {
            type: "timestamp",
            default: pgm.func("now()")
        }
    });

    pgm.createTable("listings", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "cascade"
        },
        title: {type: "text", notNull: true},
        city: {type: "text", notNull: true},
        state: {type: "text", notNull: true},
        keywords: {
            type: "text[]",
            notNull: true,
            default: pgm.func("ARRAY[]::text[]")
        },
        amenities: {
            type: "text[]",
            notNull: true,
            default: pgm.func("ARRAY[]::text[]")
        },
        note: {type: "text"},
        created_at: {
            type: "timestamp",
            default: pgm.func("now()")
        },
        updated_at: {
            type: "timestamp",
            default: pgm.func("now()")
        }
    });

    pgm.createTable("bookings", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },
        listing_id: {
            type: "uuid",
            notNull: true,
            references: "listings(id)",
            onDelete: "cascade"
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "cascade"
        },
        start_date: {type: "date", notNull: true},
        end_date: {type: "date", notNull: true},
        status: {type: "text", notNull: true},
        created_at: {
            type: "timestamp",
            default: pgm.func("now()")
        },
        updated_at: {
            type: "timestamp",
            default: pgm.func("now()")
        }
    });

    pgm.addConstraint("bookings", "booking_dates_valid", {
        check: "start_date < end_date"
    });

    pgm.addConstraint("bookings", "booking_status_check", {
        check: "status IN ('pending', 'confirmed', 'cancelled')"
    });

    pgm.createIndex("listings", "user_id");
    pgm.createIndex("bookings", "user_id");
    pgm.createIndex("bookings", "listing_id");
};

exports.down = (pgm) => {
    pgm.dropTable("bookings");
    pgm.dropTable("listings");
    pgm.dropTable("users");
};

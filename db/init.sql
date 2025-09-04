-- ========== Schema ==========

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id),
    book_id INT REFERENCES books(id),
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    return_date TIMESTAMP
);

ALTER TABLE loans ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS return_date TIMESTAMP;

CREATE TABLE IF NOT EXISTS fines (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id),
    loan_id INT REFERENCES loans(id),
    amount INT NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO members (name, email) VALUES
('Alice Johnson', 'alice@example.com'),
('Bob Smith', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', TRUE),
('To Kill a Mockingbird', 'Harper Lee', TRUE),
('1984', 'George Orwell', TRUE),
('Pride and Prejudice', 'Jane Austen', TRUE),
('Moby Dick', 'Herman Melville', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO loans (member_id, book_id, borrow_date, due_date)
VALUES (1, 1, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '6 days')
ON CONFLICT DO NOTHING;


-- Seed sample data (idempotent)
INSERT INTO members (name, email) VALUES 
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, available) VALUES
  ('1984', 'George Orwell', true),
  ('The Hobbit', 'J.R.R. Tolkien', true),
  ('To Kill a Mockingbird', 'Harper Lee', true)
ON CONFLICT DO NOTHING;

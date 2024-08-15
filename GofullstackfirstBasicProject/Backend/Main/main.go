package main

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sqlx.DB
var validate = validator.New()

// Models
type User struct {
	ID       uint32 `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
	RoleName string `json:"role_name" db:"role_name"`
}
type Food struct {
	ID       uint64 `json:"id" db:"id" validate:"required"`
	Img      string `json:"img" db:"img"  validate:"required"`
	FoodName string `json:"foodname" db:"foodname"   validate:"required"`
	Details  string `json:"details"  db:"details"  validate:"required"`
}

type CustomValidationError struct {
	HasError bool
	Field    string
	Tag      string
	Param    string
	Value    interface{}
}

type Recipe struct {
	ID       uint64 `json:"id"  db:"id"`
	Img      string `json:"img"  db:"img"`
	MatName  string `json:"matname"  db:"matname"`
	Material string `json:"material"  db:"material"`
	Details  string `json:"details"  db:"details"`
}

func Validate(data interface{}) []CustomValidationError {
	var CustomValidation []CustomValidationError

	if errors := validate.Struct(data); errors != nil {
		for _, fielderror := range errors.(validator.ValidationErrors) {
			var cve CustomValidationError
			cve.HasError = true
			cve.Field = fielderror.Field()
			cve.Tag = fielderror.Tag()
			cve.Param = fielderror.Param()
			cve.Value = fielderror.Value()

			CustomValidation = append(CustomValidation, cve)
		}
	}
	return CustomValidation
}

func initDB() {
	var err error
	db, err = sqlx.Connect("postgres", "user=postgres password=21331025 dbname=Food sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
}
func getUser(c *fiber.Ctx) error {
	var user User

	// Gelen JSON verisini struct'a parse et
	if err := c.BodyParser(&user); err != nil {
		fmt.Printf("Error parsing request body: %s\n", err)
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	var dbUser User

	// Veritabanından kullanıcıyı al
	if err := db.Get(&dbUser, "SELECT * FROM users WHERE username=$1 AND role_name=$2", user.Username, user.RoleName); err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("User not found: %s\n", err)
			return c.Status(401).JSON(fiber.Map{"error": "Invalid username or role name"})
		}
		fmt.Printf("Database error: %s\n", err)
		return c.Status(500).JSON(fiber.Map{"error": "Internal server error"})
	}

	// Şifreyi doğrula
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
		fmt.Printf("Invalid password: %s\n", err)
		return c.Status(401).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// Doğrulama başarılı
	return c.Status(200).JSON(fiber.Map{
		"status":  200,
		"message": "Login successfuly",
		"user":    dbUser,
	})
}

func createuser(c *fiber.Ctx) error {
	var newuser User
	if err := c.BodyParser(&newuser); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	hasedpassword, err := bcrypt.GenerateFromPassword([]byte(newuser.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password" + err.Error()})
	}

	newuser.Password = string(hasedpassword)

	_, err = db.NamedExec(`INSERT INTO users(username,password,role_name) Values (:username,:password,:role_name)`, &newuser)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{
		"status": 200,
		"user":   newuser,
	})

}

// Items
func getItems(c *fiber.Ctx) error {
	var items []Food
	err := db.Select(&items, "SELECT * FROM foods")
	if err != nil {
		fmt.Printf("what is Problem: %s \n", err)
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(200).JSON(items)
}

func createItem(c *fiber.Ctx) error {
	var newItem Food
	if err := c.BodyParser(&newItem); err != nil {
		fmt.Printf("Problem parsing body: %s\n", err.Error())
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	// Veritabanına kaydetme işlemi
	_, err := db.NamedExec(`INSERT INTO foods (img, foodname, details) VALUES (:img, :foodname, :details)`, &newItem)
	if err != nil {
		fmt.Printf("Problem executing query: %s\n", err.Error())
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"status":  201,
		"item":    newItem,
		"message": "Başarılı Bir Şekilde Eklendi",
	})
}
func deleteItem(c *fiber.Ctx) error {
	idStr := c.Params("id", "id")
	id, err := strconv.Atoi(idStr) // string id'yi integer'a çevir
	if err != nil {
		fmt.Printf("Invalid ID: %s\n", idStr)
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID"})
	}
	res, err := db.Exec(`DELETE FROM foods WHERE id=$1`, id)
	if err != nil {
		fmt.Printf("Problem is effect:%s", err)
		return c.Status(500).JSON(fiber.Map{
			"Message": "Problem",
		})
	}
	rowEffect, err := res.RowsAffected()
	if err != nil {
		fmt.Printf("What is the Problem %s", err)
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	if rowEffect == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Öge Bulunamadı"})
	}
	return c.Status(200).JSON(fiber.Map{
		"status":  200,
		"message": "Öge Başarıyla Silindi",
	})

}
func updateItem(c *fiber.Ctx) error {
	// id getir
	// id string ise int çevir
	// gelen öge pars et
	// veri doğrula
	// sql sorgusu çalıştır
	// satır kontrölü
	//sonuç
	idstr := c.Params("id", "id")

	id, err := strconv.Atoi(idstr)
	if err != nil {
		fmt.Printf("SEND ID: %v \n", id)
		fmt.Printf("the problem is identity %s \n", err)
		return c.Status(400).JSON(fiber.Map{"error": "Invalıd ID"})
	}
	var updatefood Food
	if err := c.BodyParser(&updatefood); err != nil {
		fmt.Printf("what is problem :%s \n", err.Error())
		return c.Status(400).JSON(fiber.Map{"error": "Invalıd input"})

	}
	if updatefood.Img == "" || updatefood.FoodName == "" || updatefood.Details == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Missing required fields"})

	}

	res, err := db.Exec(`UPDATE foods SET img=$1, foodname=$2, details=$3 WHERE id=$4`, updatefood.Img, updatefood.FoodName, updatefood.Details, id)
	if err != nil {
		fmt.Printf("query problem: %s \n", err)

		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	rowEffect, err := res.RowsAffected()
	if err != nil {
		fmt.Printf("row problem: %s \n", err)

		return c.Status(500).JSON(fiber.Map{"error": err.Error()})

	}
	if rowEffect == 0 {
		fmt.Printf("row is problem: %s \n", err)

		return c.Status(404).JSON(fiber.Map{"error": "Öge Bulunmadı"})

	}
	return c.Status(200).JSON(fiber.Map{
		"status":  200,
		"message": "Öge Başarıyla güncellendi",
	})
}
func recipecreate(c *fiber.Ctx) error {

	var newsect Recipe

	if err := c.BodyParser(&newsect); err != nil {
		fmt.Printf("status bad Req: %s \n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"Message": "status bad Req"})
	}

	_, err := db.NamedExec(`INSERT INTO section(img, matname, material, details) Values (:img, :matname, :material, :details)`, newsect)
	if err != nil {
		fmt.Printf("Internel Server Error: %s \n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"Message": "Internel server Error"})

	}

	return c.Status(201).JSON(fiber.Map{"message": "Create Succsesfuly", "status": true, "section": newsect})
}
func getrec(c *fiber.Ctx) error {
	var getrec []Recipe
	err := db.Select(&getrec, "Select * From section")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"Message": "Internel server Error"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Get Recipe", "recipe": getrec})
}
func delRecip(c *fiber.Ctx) error {
	// id getir string den int çevir
	// delete
	// satır kontrolü
	idstr := c.Params("id")
	id, err := strconv.Atoi(idstr)

	if err != nil {
		fmt.Printf("Invalid ID: %s\n", idstr)
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID"})
	}

	res, err := db.Exec(`DELETE FROM section WHERE id=$1`, id)
	if err != nil {
		fmt.Printf("response: %s\n", err)
		return c.Status(500).JSON(fiber.Map{"error": "Sql delete"})
	}
	rowaffect, err := res.RowsAffected()
	if err != nil {
		fmt.Printf("row Affect: %s\n", err)
		return c.Status(500).JSON(fiber.Map{"error": "row affect"})

	}
	if rowaffect == 0 {
		return c.Status(404).JSON(fiber.Map{"Message": "line not found"})

	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Section succsessfuly Deleted", "status": 200})
}

func updaterec(c *fiber.Ctx) error {

	body := c.Body()
	fmt.Printf("recevie Body: %s", body)
	idstr := c.Params("id", "id")

	id, err := strconv.Atoi(idstr)

	if err != nil {
		fmt.Printf("SEND ID: %v \n", id)
		fmt.Printf("ID is problem: %s\n", idstr)
		return c.Status(400).JSON(fiber.Map{"message": "İnvalid ID"})
	}
	var newrec Recipe
	if err := c.BodyParser(&newrec); err != nil {
		fmt.Printf("Body is Problem : %s\n", err)
		return c.Status(422).JSON(fiber.Map{"message": "Invaild input"})

	}
	if newrec.Img == "" || newrec.MatName == "" || newrec.Material == "" || newrec.Details == "" {
		return c.Status(400).JSON(fiber.Map{"message": "missing required fields"})
	}
	_, err = db.Exec(`UPDATE section SET  img=$1 , matname=$2 , material=$3 , details=$4 Where id=$5 `, newrec.MatName, newrec.Img, newrec.Material, newrec.Details, id)
	if err != nil {
		fmt.Printf("failed to update data : %s\n", err)
		return c.Status(500).JSON(fiber.Map{"message": "failed to update data"})
	}

	return c.Status(201).JSON(fiber.Map{
		"status":  true,
		"message": "updated succsesfuly",
		"items":   newrec,
	})
}
func main() {
	initDB()
	defer db.Close()

	app := fiber.New()
	// CORS middleware ekleme
	app.Use(cors.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Content-Type",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://gofiber.io, https://gofiber.net",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))
	app.Static("/Frontend/Img", "./Frontend/Img")

	// Dosya yükleme endpoint'i

	// items
	app.Get("/foods", getItems)
	app.Post("/food", createItem)
	app.Delete("/foods/:id", deleteItem)
	app.Put("/getfood/:id", updateItem)

	// user
	app.Post("/login", getUser)
	app.Post("/register", createuser)
	// section
	app.Post("/recipe", recipecreate)
	app.Get("/getrec", getrec)
	app.Delete("/delrec/:id", delRecip)
	app.Put("/putrec/:id", updaterec)

	log.Fatal(app.Listen(":3000"))
}

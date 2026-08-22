package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "backend-go"})
	})

	v1 := r.Group("/api/v1")
	{
		v1.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Stack 3 — Go backend running"})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8002"
	}
	r.Run(":" + port)
}

package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/deliriumproducts/aumo"
	"github.com/gomodule/redigo/redis"
	uuid "github.com/google/uuid"
)

const (
	CookieKey      = "aumo"
	UserContextKey = "aumo_user"
)

var (
	// ErrBadTypeAssertion is an error for when an assertion failed
	ErrBadTypeAssertion = errors.New("auth: failed to assert type")
)

// Authenticator holds the methods and config used for authentication
type Authenticator struct {
	redis      redis.Conn
	us         aumo.UserService
	expiryTime int
}

// New returns new Auth instance
func New(r redis.Conn, us aumo.UserService, expiryTime int) *Authenticator {
	return &Authenticator{
		redis:      r,
		us:         us,
		expiryTime: expiryTime,
	}
}

// NewSession creates a session and returns the session ID
func (a *Authenticator) NewSession(u *aumo.User) (string, error) {
	sID := uuid.New().String()

	_, err := a.redis.Do("SETEX", sID, string(a.expiryTime), u.ID)
	if err != nil {
		return "", err
	}

	return sID, err
}

// Get gets a session from Redis based on the session ID
func (a *Authenticator) Get(sID string) (*aumo.User, error) {
	val, err := a.redis.Do("GET", sID)
	if err != nil {
		return nil, err
	}

	uID, ok := val.(uint)
	if !ok {
		return nil, ErrBadTypeAssertion
	}

	return a.us.User(uID, false)
}

// Get gets a session from Redis based on the Cookie value from the request
func (a *Authenticator) GetFromRequest(r *http.Request) (*aumo.User, error) {
	cookie, err := r.Cookie(CookieKey)
	if err != nil {
		return nil, err
	}

	return a.Get(cookie.Value)
}

// SetCookieHeader sets the cookie to the response
func (a *Authenticator) SetCookieHeader(w http.ResponseWriter, sID string) {
	http.SetCookie(w, &http.Cookie{
		Name:  CookieKey,
		Value: sID,
		Expires: time.Now().Add(
			time.Duration(a.expiryTime) * time.Second,
		),
	})
}
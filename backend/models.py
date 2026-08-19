from sqlalchemy import Column, String, Integer, Float, DateTime, func, Boolean, ForeignKey, Text, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# 1. USERS
class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False) # admin, ngo_user, volunteer, public
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    ngo_profile = relationship("NGOProfile", back_populates="user", uselist=False)
    volunteer_profile = relationship("VolunteerProfile", back_populates="user", uselist=False)

# 2. NGO_PROFILES
class NGOProfile(Base):
    __tablename__ = "ngo_profiles"

    ngo_id = Column(String, ForeignKey("users.user_id"), primary_key=True)
    org_name = Column(String, nullable=False)
    registration_number = Column(String, unique=True, nullable=False)
    head_of_operations = Column(String)
    phone = Column(String)
    phone_verified = Column(Boolean, default=False)
    base_city = Column(String)
    base_district = Column(String)
    base_province = Column(String)
    base_location = Column(Geometry("POINT", srid=4326))
    service_radius_km = Column(Integer, default=10)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String, ForeignKey("users.user_id"))

    user = relationship("User", back_populates="ngo_profile")
    resources = relationship("NGOResource", back_populates="ngo", uselist=False)
    specializations = relationship("NGOSpecialization", back_populates="ngo")
    operational_areas = relationship("NGOOperationalArea", back_populates="ngo")

# 3. NGO_RESOURCES
class NGOResource(Base):
    __tablename__ = "ngo_resources"

    resource_id = Column(String, primary_key=True, default=generate_uuid)
    ngo_id = Column(String, ForeignKey("ngo_profiles.ngo_id"), unique=True)
    
    ambulances = Column(Integer, default=0)
    rescue_boats = Column(Integer, default=0)
    trucks = Column(Integer, default=0)
    four_wheel_vehicles = Column(Integer, default=0)
    cranes = Column(Integer, default=0)
    doctors = Column(Integer, default=0)
    paramedics = Column(Integer, default=0)
    rescue_divers = Column(Integer, default=0)
    volunteers_available = Column(Integer, default=0)
    food_packets_capacity = Column(Integer, default=0)
    shelter_capacity = Column(Integer, default=0)

    ngo = relationship("NGOProfile", back_populates="resources")

# 4. NGO_SPECIALIZATIONS
class NGOSpecialization(Base):
    __tablename__ = "ngo_specializations"
    id = Column(String, primary_key=True, default=generate_uuid)
    ngo_id = Column(String, ForeignKey("ngo_profiles.ngo_id"))
    specialization = Column(String, nullable=False)
    ngo = relationship("NGOProfile", back_populates="specializations")

# 5. NGO_OPERATIONAL_AREAS
class NGOOperationalArea(Base):
    __tablename__ = "ngo_operational_areas"
    id = Column(String, primary_key=True, default=generate_uuid)
    ngo_id = Column(String, ForeignKey("ngo_profiles.ngo_id"))
    province = Column(String, nullable=False)
    district = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    ngo = relationship("NGOProfile", back_populates="operational_areas")

# 6. VOLUNTEER_PROFILES
class VolunteerProfile(Base):
    __tablename__ = "volunteer_profiles"

    volunteer_id = Column(String, ForeignKey("users.user_id"), primary_key=True)
    full_name = Column(String, nullable=False)
    cnic = Column(String, unique=True)
    phone = Column(String)
    home_city = Column(String)
    home_district = Column(String)
    home_province = Column(String)
    home_location = Column(Geometry("POINT", srid=4326))
    is_available = Column(Boolean, default=True)
    tasks_completed = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    user = relationship("User", back_populates="volunteer_profile")
    capabilities = relationship("VolunteerCapability", back_populates="volunteer", uselist=False)

# 7. VOLUNTEER_CAPABILITIES
class VolunteerCapability(Base):
    __tablename__ = "volunteer_capabilities"
    id = Column(String, primary_key=True, default=generate_uuid)
    volunteer_id = Column(String, ForeignKey("volunteer_profiles.volunteer_id"), unique=True)
    
    has_motorbike = Column(Boolean, default=False)
    has_car = Column(Boolean, default=False)
    has_truck = Column(Boolean, default=False)
    has_boat = Column(Boolean, default=False)
    skill_first_aid = Column(Boolean, default=False)
    skill_cpr = Column(Boolean, default=False)
    skill_swimming = Column(Boolean, default=False)
    can_heavy_lifting = Column(Boolean, default=False)
    can_distribute = Column(Boolean, default=False)
    offers_shelter = Column(Boolean, default=False)
    shelter_capacity = Column(Integer, default=0)
    # languages = Column(ARRAY(String)) # Requires proper PG setup, usually better as JSON or separate table for simplicity in MVP

    volunteer = relationship("VolunteerProfile", back_populates="capabilities")

# 8. DISASTER_EVENTS
class DisasterEvent(Base):
    __tablename__ = "disaster_events"

    event_id = Column(String, primary_key=True, default=generate_uuid)
    external_ref_id = Column(String)
    event_type = Column(String, nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    location_name = Column(String)
    district = Column(String)
    province = Column(String)
    
    # PostGIS
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    affected_area = Column(Geometry("POLYGON", srid=4326))
    
    affected_population = Column(Integer)
    severity_score = Column(Float)
    risk_level = Column(String) # low, medium, high, critical
    source_type = Column(String)
    verification_status = Column(String, default='pending')
    event_status = Column(String, default='detected')
    verified_by = Column(String, ForeignKey("users.user_id"))

    sources = relationship("DisasterSource", back_populates="event")
    tasks = relationship("Task", back_populates="event")
    news_reports = relationship("NewsReport", back_populates="event")

# 9. DISASTER_SOURCES
class DisasterSource(Base):
    __tablename__ = "disaster_sources"
    id = Column(String, primary_key=True, default=generate_uuid)
    event_id = Column(String, ForeignKey("disaster_events.event_id"))
    source_type = Column(String)
    source_name = Column(String)
    source_url = Column(Text)
    raw_data = Column(JSONB)
    confidence_score = Column(Float)
    event = relationship("DisasterEvent", back_populates="sources")

# 10. TASKS
class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String, primary_key=True, default=generate_uuid)
    event_id = Column(String, ForeignKey("disaster_events.event_id"))
    task_label = Column(String, nullable=False)
    description = Column(Text)
    task_type = Column(String)
    required_quantity = Column(Integer)
    priority = Column(String)
    
    target_location = Column(Geometry("POINT", srid=4326))
    target_location_name = Column(String)
    
    admin_approval_status = Column(String, default='pending')
    admin_approved_by = Column(String, ForeignKey("users.user_id"))
    
    assignment_status = Column(String, default='unallocated')
    assigned_ngo_id = Column(String, ForeignKey("ngo_profiles.ngo_id"))
    assigned_volunteer_id = Column(String, ForeignKey("volunteer_profiles.volunteer_id"))
    
    assigned_at = Column(DateTime)
    completed_at = Column(DateTime)
    completion_notes = Column(Text)

    event = relationship("DisasterEvent", back_populates="tasks")
    history = relationship("TaskStatusHistory", back_populates="task")

# 11. TASK_STATUS_HISTORY
class TaskStatusHistory(Base):
    __tablename__ = "task_status_history"
    id = Column(String, primary_key=True, default=generate_uuid)
    task_id = Column(String, ForeignKey("tasks.task_id"))
    old_status = Column(String)
    new_status = Column(String)
    changed_by = Column(String, ForeignKey("users.user_id"))
    change_reason = Column(Text)
    changed_at = Column(DateTime, server_default=func.now())
    task = relationship("Task", back_populates="history")

# 12. NEWS_REPORTS
class NewsReport(Base):
    __tablename__ = "news_reports"

    report_id = Column(String, primary_key=True, default=generate_uuid)
    content = Column(Text)
    image_url = Column(Text)
    source_type = Column(String)
    related_event_id = Column(String, ForeignKey("disaster_events.event_id"))
    verification_status = Column(String, default='pending')
    confidence_score = Column(Float)
    ai_explanation = Column(Text)
    ai_agent_report = Column(JSONB)
    submitted_by = Column(String, ForeignKey("users.user_id"))

    event = relationship("DisasterEvent", back_populates="news_reports")
    sources = relationship("NewsSource", back_populates="report")

# 13. NEWS_SOURCES
class NewsSource(Base):
    __tablename__ = "news_sources"
    id = Column(String, primary_key=True, default=generate_uuid)
    report_id = Column(String, ForeignKey("news_reports.report_id"))
    source_name = Column(String)
    source_url = Column(Text)
    is_supporting = Column(Boolean)
    report = relationship("NewsReport", back_populates="sources")

# 14. SOCIAL_ALERTS
class SocialAlert(Base):
    __tablename__ = "social_alerts"
    alert_id = Column(String, primary_key=True, default=generate_uuid)
    event_id = Column(String, ForeignKey("disaster_events.event_id"))
    platform = Column(String)
    content_text = Column(Text)
    content_image_url = Column(Text)
    post_url = Column(Text)
    status = Column(String, default='queued')
    published_at = Column(DateTime)

# 15. NOTIFICATIONS
class Notification(Base):
    __tablename__ = "notifications"
    notification_id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.user_id"))
    title = Column(String)
    message = Column(Text)
    notification_type = Column(String)
    related_task_id = Column(String, ForeignKey("tasks.task_id"))
    related_event_id = Column(String, ForeignKey("disaster_events.event_id"))
    is_read = Column(Boolean, default=False)

# 16. AUDIT_LOGS
class AuditLog(Base):
    __tablename__ = "audit_logs"
    log_id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.user_id"))
    action = Column(String)
    entity_type = Column(String)
    entity_id = Column(String)
    old_values = Column(JSONB)
    new_values = Column(JSONB)
    ip_address = Column(String)
    created_at = Column(DateTime, server_default=func.now())


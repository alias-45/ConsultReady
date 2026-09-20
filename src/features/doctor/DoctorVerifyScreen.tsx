import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { RequestAccess } from '../../components/doctor/RequestAccess';
import { WaitingApproval } from '../../components/doctor/WaitingApproval';
import { ErrorState } from '../../components/common/ErrorState';

interface DoctorVerifyScreenProps {
  sessionId: string;
  onAccessGranted: () => void;
  onCancel: () => void;
  onSwitchToPatientView: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const DoctorVerifyScreen: React.FC<DoctorVerifyScreenProps> = ({
  sessionId,
  onAccessGranted,
  onCancel,
  onSwitchToPatientView,
  onShowToast
}) => {
  const getSession = useSessionStore((state) => state.getSession);
  const sendAccessRequest = useSessionStore((state) => state.sendAccessRequest);

  const [isSending, setIsSending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const session = getSession(sessionId);

  if (!session) {
    return (
      <div className="p-4">
        <ErrorState
          title="Session Not Found"
          message="The scanned session ID could not be located in the clinical system."
          onBack={onCancel}
          backLabel="Scan Again"
        />
      </div>
    );
  }

  // If session is already active, go directly to records!
  if (session.status === 'active') {
    onAccessGranted();
    return null;
  }

  const handleSendRequest = (requesterName: string, requesterRole: string) => {
    setIsSending(true);
    setTimeout(() => {
      const res = sendAccessRequest(sessionId, requesterName, requesterRole);
      setIsSending(false);

      if (res.success) {
        onShowToast(
          'Request Sent to Patient',
          `Notification dispatched to ${session.patientName}. Waiting for acceptance.`,
          'info'
        );
      } else {
        setRequestError(res.error || 'Failed to send access request.');
      }
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-full pb-20 animate-in fade-in duration-200">
      {requestError && (
        <div className="p-4">
          <ErrorState
            title="Request Failed"
            message={requestError}
            onBack={onCancel}
            backLabel="Back to Scanner"
          />
        </div>
      )}

      {!requestError && (
        <>
          {session.status === 'requested' ? (
            <WaitingApproval
              session={session}
              onApproved={onAccessGranted}
              onCancel={onCancel}
              onSwitchToPatientView={onSwitchToPatientView}
            />
          ) : (
            <RequestAccess
              session={session}
              onRequestAccess={handleSendRequest}
              onCancel={onCancel}
              isSending={isSending}
            />
          )}
        </>
      )}
    </div>
  );
};
